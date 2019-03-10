package com.rakuten.shop.index.controller;

import com.rakuten.shop.index.core.*;
import com.rakuten.shop.index.service.ShopValidatorService;
import com.rakuten.shop.index.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@Controller
public class FileUploadController {

    private final StorageService storageService;
    private final ShopValidatorService shopValidatorService;


    @Autowired
    public FileUploadController(StorageService storageService, ShopValidatorService shopValidatorService) {
        this.storageService = storageService;
        this.shopValidatorService = shopValidatorService;
    }

    @PostMapping("/upload")
    @ResponseBody
    public List<Shop> handleFileUpload(@RequestParam("file") MultipartFile file) throws Exception {
        storageService.store(file);
        Path fileName = storageService.load(file.getOriginalFilename());
        List<Shop> shops = shopValidatorService.validateFileContent(fileName);
        return shops;
    }

    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(DuplicatedEntryException.class)
    public ResponseEntity<?> handleDuplicatedEntryException(DuplicatedEntryException exc) {

        return ResponseEntity.badRequest().body(exc.getMessage());
    }

    @ExceptionHandler(InvalidDateRangeException.class)
    public ResponseEntity<?> handleInvalidDateRangeException(InvalidDateRangeException exc) {
        return ResponseEntity.badRequest().body(exc.getMessage());
    }

    @ExceptionHandler(InvalidCSVContentException.class)
    public ResponseEntity<?> handleInvalidCSVContentException(InvalidCSVContentException exc) {
        return ResponseEntity.badRequest().body(exc.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGenericException(Exception exc) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(exc);
    }
}
