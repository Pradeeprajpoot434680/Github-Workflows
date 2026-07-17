package com.GithubActions.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class CorsConfig implements WebMvcConfigurer {


    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                .allowedOrigins(
                    "http://13.207.150.137"
                )
                .allowedMethods(
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE"
                )
                .allowedHeaders("*");

    }
}