package com.rakuten.shop.index.service;

import com.rakuten.shop.index.core.Shop;


public interface ShopValidatorService {

    boolean validateShopOpenDuration(Shop shop);

    boolean validateFileContent(String fileName) throws  Exception;
}
