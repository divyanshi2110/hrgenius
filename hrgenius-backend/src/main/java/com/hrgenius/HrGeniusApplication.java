package com.hrgenius;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

@SpringBootApplication
public class HrGeniusApplication {

    public static void main(String[] args) {
        SpringApplication.run(HrGeniusApplication.class, args);
    }
}
