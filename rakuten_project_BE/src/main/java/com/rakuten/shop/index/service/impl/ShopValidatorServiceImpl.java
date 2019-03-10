package com.rakuten.shop.index.service.impl;

import com.rakuten.shop.index.core.DuplicatedEntryException;
import com.rakuten.shop.index.core.InvalidCSVContentException;
import com.rakuten.shop.index.core.InvalidDateRangeException;
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
import java.nio.file.Path;
import java.util.*;


@Service
public class ShopValidatorServiceImpl implements ShopValidatorService {
    @Override
    public boolean validateShopOpenDuration(Shop shop) {
        return shop.getStartDate() > shop.getEndDate();
    }

    final static String SHOP_KEY = "shop";
    final static String START_DATE = "start_date";
    final static String END_DATE = "end_date";

    private boolean validateCSVHeaders(Map<String, Integer> headers) {
        int shopIndex = headers.get(SHOP_KEY) == null ? -1 : headers.get(SHOP_KEY);
        int startDateIndex = headers.get(START_DATE) == null ? -1 : headers.get(START_DATE);
        int endDateIndex = headers.get(END_DATE) == null ? -1 : headers.get(END_DATE);
        if (shopIndex != 0 || startDateIndex != 1 || endDateIndex != 2) {
            throw new InvalidCSVContentException("Invalid CSV Format Found. Expected the Header :  (shop, start_date, end_date)");
        }
        return true;
    }

    public List<Shop> validateFileContent(Path file) throws Exception {
        Reader reader = null;
        CSVParser csvParser = null;
        HashMap<String, Shop> hasMap = new HashMap<>();
        try {
            reader = new BufferedReader(new FileReader(file.toAbsolutePath().toString()));
            csvParser = new CSVParser(reader, CSVFormat.DEFAULT
                    .withFirstRecordAsHeader()
                    .withIgnoreHeaderCase()
                    .withTrim());
            final Map<String, Integer> headers = csvParser.getHeaderMap();

            validateCSVHeaders(headers);

            for (CSVRecord csvRecord : csvParser) {
                // Accessing values by Header names
                Integer index = null, startDate = null, endDate = null;
                try {
                    index = Integer.parseInt(csvRecord.get(SHOP_KEY));
                    startDate = Integer.parseInt(csvRecord.get(START_DATE));
                    endDate = Integer.parseInt(csvRecord.get(END_DATE));
                } catch (NumberFormatException ex) {

                }
                Shop shopEntity = new Shop(index, startDate, endDate);
                Shop storedEntry = hasMap.get(index.toString());
                if (storedEntry != null && Objects.equals(shopEntity, storedEntry)) {
                    throw new DuplicatedEntryException("Duplicated Entry Found :" + shopEntity.toString());
                }

                if (validateShopOpenDuration(shopEntity)) {
                    throw new InvalidDateRangeException("Invalid Date Range Found : " + shopEntity.toString());
                }
                hasMap.put(index.toString(), shopEntity);
            }
            return new ArrayList<Shop>(hasMap.values());
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
