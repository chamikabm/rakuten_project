package com.rakuten.shop.index.core;


public class Shop {
    int index;
    int startDate;
    int endDate;

    public Shop(int index, int startDate, int endDate) {
        this.index = index;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public int getStartDate() {
        return startDate;
    }

    public void setStartDate(int startDate) {
        this.startDate = startDate;
    }

    public int getEndDate() {
        return endDate;
    }

    public void setEndDate(int endDate) {
        this.endDate = endDate;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }
}
