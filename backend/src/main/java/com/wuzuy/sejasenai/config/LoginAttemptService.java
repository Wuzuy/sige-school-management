package com.wuzuy.sejasenai.config;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long LOCK_TIME_DURATION = TimeUnit.MINUTES.toMillis(15);

    private final Map<String, AttemptInfo> attemptsCache = new ConcurrentHashMap<>();

    private static class AttemptInfo {
        int attempts;
        long lockTime;

        AttemptInfo() {
            this.attempts = 0;
            this.lockTime = 0;
        }
    }

    /**
     * Registra uma tentativa de login bem-sucedida
     */
    public void loginSucceeded(String key) {
        attemptsCache.remove(key);
    }

    /**
     * Registra uma tentativa de login falhada
     */
    public void loginFailed(String key) {
        AttemptInfo info = attemptsCache.computeIfAbsent(key, k -> new AttemptInfo());
        info.attempts++;
        
        if (info.attempts >= MAX_ATTEMPTS) {
            info.lockTime = System.currentTimeMillis() + LOCK_TIME_DURATION;
        }
    }

    /**
     * Verifica se o usuário está bloqueado
     */
    public boolean isBlocked(String key) {
        AttemptInfo info = attemptsCache.get(key);
        
        if (info == null) {
            return false;
        }

        if (info.lockTime > 0 && System.currentTimeMillis() < info.lockTime) {
            return true;
        }

        // Se o tempo de bloqueio passou, limpa o registro
        if (info.lockTime > 0 && System.currentTimeMillis() >= info.lockTime) {
            attemptsCache.remove(key);
            return false;
        }

        return info.attempts >= MAX_ATTEMPTS;
    }

    /**
     * Retorna o número de tentativas restantes antes do bloqueio
     */
    public int getRemainingAttempts(String key) {
        AttemptInfo info = attemptsCache.get(key);
        if (info == null) {
            return MAX_ATTEMPTS;
        }
        return Math.max(0, MAX_ATTEMPTS - info.attempts);
    }

    /**
     * Retorna o tempo restante de bloqueio em minutos
     */
    public long getRemainingLockTime(String key) {
        AttemptInfo info = attemptsCache.get(key);
        if (info == null || info.lockTime == 0) {
            return 0;
        }
        long remaining = info.lockTime - System.currentTimeMillis();
        return remaining > 0 ? TimeUnit.MILLISECONDS.toMinutes(remaining) + 1 : 0;
    }
}
