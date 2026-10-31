# Build stage using Maven and Eclipse Temurin Java 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /workspace/app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage using Eclipse Temurin JRE 21
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /workspace/app/target/hrgenius-backend-1.0.0.jar app.jar

ENV PORT=8081
ENV SPRING_PROFILES_ACTIVE=cloud

EXPOSE 8081
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
