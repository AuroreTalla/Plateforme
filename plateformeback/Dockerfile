# ===============================
# Stage 1: Build avec Maven
# ===============================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# ===============================
# Stage 2: Runtime léger
# ===============================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render injecte la variable PORT
ENV PORT=8081
ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE ${PORT}

ENTRYPOINT ["java", "-Xms256m", "-Xmx512m", "-jar", "app.jar"]