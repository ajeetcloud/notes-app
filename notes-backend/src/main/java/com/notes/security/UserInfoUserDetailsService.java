package com.notes.security;

import com.notes.model.UserInfo;
import com.notes.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Optional;

@Component
public class UserInfoUserDetailsService implements UserDetailsService {

    @Autowired
    private UserInfoRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserInfo> userInfo = repository.findByUsername(username);

        if (!userInfo.isPresent()) {
            throw new UsernameNotFoundException("User not found");
        }
        UserInfo userInfoObj = userInfo.get();

        CustomUserDetails customUserDetails = new CustomUserDetails(userInfoObj.getUsername(), userInfoObj.getPassword(),
                new ArrayList<>());
        customUserDetails.setUsername(userInfoObj.getUsername());
        customUserDetails.setUserId(userInfoObj.getUserId());
        customUserDetails.setFirstName(userInfoObj.getFirstName());
        customUserDetails.setLastName(userInfoObj.getLastName());
        customUserDetails.setEmail(userInfoObj.getEmail());
        customUserDetails.setRefreshToken(userInfoObj.getRefreshToken());

        return customUserDetails;
    }
}
