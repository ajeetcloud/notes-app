package com.notes.controller;

import com.notes.component.BlacklistTokenCache;
import com.notes.dto.TokenDTO;
import com.notes.dto.UserInfoDTO;
import com.notes.model.UserInfo;
import com.notes.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class UserInfoController {

    @Autowired
    private BlacklistTokenCache blacklistTokenCache;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserInfoService userInfoService;

    @PostMapping("/signout")
    public void signout(@RequestBody TokenDTO tokenDTO) {
        blacklistTokenCache.blacklistToken(tokenDTO.getToken());
        System.out.println(blacklistTokenCache);
    }

    @PostMapping("/user")
    public UserInfo signup(@RequestBody UserInfo userInfo) {
        userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
        return userInfoService.createUser(userInfo);
    }

    @PatchMapping("/user/{userId}")
    public UserInfo updateUserInfo(@PathVariable int userId, @RequestBody UserInfoDTO userInfoDTO) {
        return userInfoService.updateUserInfo(userId, userInfoDTO);
    }
}
