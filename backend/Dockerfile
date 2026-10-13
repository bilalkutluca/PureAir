FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Gerekli araçları yükle
RUN apt-get update && apt-get install -y curl bc bash && rm -rf /var/lib/apt/lists/*

COPY . /app

# Maven bağımlılıklarını indir ve uygulamayı derle
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# JAR dosyasını çalıştır
CMD ["java", "-jar", "target/PureairBackend-0.0.1-SNAPSHOT.jar"]