package com.notes.component;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.concurrent.TimeUnit;

@Component
public class BlacklistTokenCache {

    private Cache<String, Boolean> cache;

    //private long cacheTTL = 120; // 120

    @Value("${jwt.ttl}")
    private long cacheTTL; // 120

    private long cacheSize = 5000; // 5000

    @PostConstruct
    public void initialize() {
        cache = CacheBuilder.newBuilder().maximumSize(cacheSize).expireAfterWrite(cacheTTL, TimeUnit.SECONDS).build();
    }

    public void blacklistToken(String token) {
        cache.put(token, Boolean.TRUE);
        System.out.println(cache.size());
    }

    public boolean isTokenBlacklisted(String token) {
        return cache.getIfPresent(token) != null;
    }
}


