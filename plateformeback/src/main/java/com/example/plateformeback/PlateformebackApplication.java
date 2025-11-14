package com.example.plateformeback;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class PlateformebackApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlateformebackApplication.class, args);
	}

}
