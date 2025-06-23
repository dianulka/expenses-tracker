package com.diana.expensestracker.dto;


public class RegisterUserDto {
    private String email;

    private String password;

    private String username;


    public String getPassword(){
        return password;
    }
    public String getEmail(){
        return email;
    }
    public String getUsername(){return username;}
    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
