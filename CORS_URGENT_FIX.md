# 🚨 URGENT: Add This CORS Config to Your Backend

## The Issue
Network errors are happening because your Spring Boot backend needs CORS configuration to allow requests from React frontend (localhost:3000).

## ✅ EXACT SOLUTION (Copy-Paste This)

**Create this file in your Spring Boot project:**

📁 `src/main/java/com/kaamwala/config/CorsConfig.java`

```java
package com.kaamwala.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 🚀 Steps:
1. **Create the file above** in your backend
2. **Restart your Spring Boot server**
3. **Try registration again** - should work immediately!

## Alternative Quick Fix:
Add this annotation to ALL your controllers:

```java
@CrossOrigin(origins = "http://localhost:3000")
```

For example:
```java
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")  // Add this line
public class UserController {
    // ... your existing code
}
```

Do the same for:
- UserController
- CategoryController  
- AuthController
- All other controllers

---

**After adding CORS config, registration will work perfectly! 🎉**


