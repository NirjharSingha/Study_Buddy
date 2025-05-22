package com.example.Hackathon.dto;
import com.example.Hackathon.enums.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public class JwtAuthResponse {
  private String token;
  @Enumerated(EnumType.STRING)
  private Role role;
  private String error;

  // Private constructor to enforce the use of builder
  private JwtAuthResponse(Builder builder) {
    this.token = builder.token;
    this.role = builder.role;
    this.error = builder.error;
  }

  // Default constructor if needed
  public JwtAuthResponse() {}

  // Getters
  public String getToken() {
    return token;
  }

  public Role getRole() {
    return role;
  }

  public String getError() {
    return error;
  }

  // Setters
  public void setToken(String token) {
    this.token = token;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public void setError(String error) {
    this.error = error;
  }

  // Static method to create builder instance
  public static Builder builder() {
    return new Builder();
  }

  // Builder class
  public static class Builder {
    private String token;
    private Role role;
    private String error;

    private Builder() {}

    public Builder token(String token) {
      this.token = token;
      return this;
    }

    public Builder role(Role role) {
      this.role = role;
      return this;
    }

    public Builder error(String error) {
      this.error = error;
      return this;
    }

    public JwtAuthResponse build() {
      return new JwtAuthResponse(this);
    }
  }
}
