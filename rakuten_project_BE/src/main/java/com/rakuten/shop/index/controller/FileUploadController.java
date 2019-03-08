package com.rakuten.shop.index.controller;

import com.rakuten.shop.index.core.StorageFileNotFoundException;
import com.rakuten.shop.index.service.ShopValidatorService;
import com.rakuten.shop.index.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
    public String handleFileUpload(@RequestParam("file") MultipartFile file,
                                   RedirectAttributes redirectAttributes)  throws Exception{
        storageService.store(file);
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        shopValidatorService.validateFileContent(fileName);
        redirectAttributes.addFlashAttribute("message",
                "You successfully uploaded " + file.getOriginalFilename() + "!");


        return "redirect:/";
    }

    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleStorageFileNotFound(Exception exc) {
        return ResponseEntity.badRequest().build();
    }
}
