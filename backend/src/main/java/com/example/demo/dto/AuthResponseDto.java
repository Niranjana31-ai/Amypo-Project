package com.example.demo.dto;

public class AuthResponseDto {
    private String token;
    private String username;
    private String role;

    private AuthResponseDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final AuthResponseDto obj = new AuthResponseDto();
        public Builder token(String token) { obj.token = token; return this; }
        public Builder username(String username) { obj.username = username; return this; }
        public Builder role(String role) { obj.role = role; return this; }
        public AuthResponseDto build() { return obj; }
    }

    public String getToken() { return token; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
}
