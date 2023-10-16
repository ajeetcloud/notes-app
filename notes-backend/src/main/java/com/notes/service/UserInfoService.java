package com.notes.service;

import com.notes.dto.UserInfoDTO;
import com.notes.model.UserInfo;
import com.notes.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;

@Service
public class UserInfoService {

    @Autowired
    private UserInfoRepository userInfoRepository;


    public UserInfo createUser(UserInfo userInfo) {
        
        long currentTime = System.currentTimeMillis();
        userInfo.setUpdatedOn(currentTime);
        userInfo.setCreatedOn(currentTime);
        return userInfoRepository.save(userInfo);
    }

    public UserInfo updateUserInfo(int id, UserInfoDTO userInfoDTO) {

        UserInfo userInfo = userInfoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
        getUpdatedEntityFromDto(userInfoDTO, userInfo);
        userInfo.setUpdatedOn(System.currentTimeMillis());
        return userInfoRepository.save(userInfo);
    }

    private void getUpdatedEntityFromDto(UserInfoDTO userInfoDTO, UserInfo userInfo) {
        if (userInfoDTO.getFirstName() != null) {
            userInfo.setFirstName(userInfoDTO.getFirstName());
        }
        if (userInfoDTO.getLastName() != null) {
            userInfo.setLastName(userInfoDTO.getLastName());
        }
        if (userInfoDTO.getEmail() != null) {
            userInfo.setEmail(userInfoDTO.getEmail());
        }
        if (userInfoDTO.getRefreshToken() != null) {
            userInfo.setRefreshToken(userInfoDTO.getRefreshToken());
        }
    }
}
