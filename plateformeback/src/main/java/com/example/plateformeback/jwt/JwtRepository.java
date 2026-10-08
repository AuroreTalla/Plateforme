package com.example.plateformeback.jwt;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.stream.Stream;

@Repository
public interface JwtRepository extends CrudRepository<Jwt, Long> {  // ✅ Integer → Long

    Optional<Jwt> findByValeurAndDesactive(String valeur, boolean desactive);

    Optional<Jwt> findByUsersEmailAndDesactive(String email, boolean desactive);

    Stream<Jwt> findByUsersEmail(String email);

    Optional<Jwt> findByRefreshTokenValeur(String valeur);

    void deleteAllByDesactive(boolean desactive);
}
