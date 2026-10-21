package com.example.plateformeback.jwt;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.stream.Stream;
import java.util.List;

@Repository
public interface JwtRepository extends CrudRepository<Jwt, Long> {  // ✅ Integer → Long

    List<Jwt> findByValeurAndDesactive(String valeur, boolean desactive);

    Optional<Jwt> findByUsersEmailAndDesactive(String email, boolean desactive);

    Stream<Jwt> findByUsersEmail(String email);

    List<Jwt> findAllByRefreshTokenValeur(String valeur);

    void deleteAllByDesactive(boolean desactive);
}
