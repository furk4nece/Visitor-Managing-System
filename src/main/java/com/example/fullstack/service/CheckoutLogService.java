package com.example.fullstack.service;

import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CheckoutLogService {

    public void logCheckout(Long visitorId) {
        Thread.ofVirtual().start(() ->
                Log.infof("Checkout islemi basladi. visitorId=%d thread=%s", visitorId, Thread.currentThread())
        );
    }
}