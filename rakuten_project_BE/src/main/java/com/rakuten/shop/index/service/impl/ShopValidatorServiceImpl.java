package com.rakuten.shop.index.service.impl;

import com.rakuten.shop.index.core.Shop;
import com.rakuten.shop.index.service.ShopValidatorService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.HashMap;


@Service
public class ShopValidatorServiceImpl implements ShopValidatorService {
    @Override
    public boolean validateShopOpenDuration(Shop shop) {
        return shop.getStartDate() > shop.getEndDate();
    }


    public boolean validateFileContent(String file) throws  Exception{
        Reader reader = null;
        CSVParser csvParser = null;
        HashMap<Integer, Shop> hasMap = new HashMap<>();
        try {
            reader = new BufferedReader(new FileReader(file));
            csvParser = new CSVParser(reader, CSVFormat.DEFAULT
                    .withFirstRecordAsHeader()
                    .withIgnoreHeaderCase()
                    .withTrim());

            for (CSVRecord csvRecord : csvParser) {
                // Accessing values by Header names
                int index, startDate , endDate;
                index = Integer.parseInt(csvRecord.get("shop"));
                startDate = Integer.parseInt(csvRecord.get("start_date"));
                endDate = Integer.parseInt(csvRecord.get("end_date"));

                Shop shopEntity = new Shop(index, startDate, endDate);
                if (hasMap.get(index) != null || validateShopOpenDuration(shopEntity)) {
                    return false;
                }
                hasMap.put(shopEntity.getIndex(), shopEntity);
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {

                }
            }
            if (csvParser != null) {
                try {
                    csvParser.close();
                } catch (IOException e) {

                }
            }
        }
    }
}
