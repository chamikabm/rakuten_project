package com.rakuten.shop.index.service;

import com.rakuten.shop.index.core.Shop;

import java.nio.file.Path;
import java.util.List;

public interface ShopValidatorService {

    boolean validateShopOpenDuration(Shop shop);

    List<Shop> validateFileContent(Path fileName) throws Exception;
}
