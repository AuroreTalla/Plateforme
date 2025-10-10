package com.example.plateformeback.jwt;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.stream.Stream;

@Repository
public interface JwtRepository extends CrudRepository<Jwt, Integer> {

    Optional<Jwt> findByValeurAndDesactiveAndExpire(String valeur, boolean desactive, boolean expire);

    Optional<Jwt> findByUsersEmailAndDesactiveAndExpire(String email, boolean desactive, boolean expire);

    Stream<Jwt> findByUsersEmail(String email);

    Optional<Jwt> findByRefreshTokenValeur(String valeur);

    void deleteAllByExpireAndDesactive(boolean expire, boolean desactive);
}
