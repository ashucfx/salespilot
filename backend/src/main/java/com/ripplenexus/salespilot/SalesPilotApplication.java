package com.ripplenexus.salespilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
@EnableScheduling
public class SalesPilotApplication {

    public static void main(String[] args) {
        SpringApplication.run(SalesPilotApplication.class, args);
    }

    @org.springframework.context.annotation.Bean
    public org.springframework.beans.factory.config.BeanPostProcessor hikariConfigPostProcessor() {
        return new org.springframework.beans.factory.config.BeanPostProcessor() {
            @Override
            public Object postProcessBeforeInitialization(Object bean, String beanName) {
                if (bean instanceof com.zaxxer.hikari.HikariDataSource hikariDataSource) {
                    hikariDataSource.addDataSourceProperty("stringtype", "unspecified");
                }
                return bean;
            }
        };
    }
}
