package com.pingchuan.weather.Model;

import java.util.List;

/**
 * @description: 分页结果
 * @author: XW
 * @create: 2019-05-31 10:14
 **/
public class PageResult<T> {
    private static final long serialVersionUID = 1L;
    private long total;
    private List<T> rows;

    public PageResult(long total, List<T> rows) {
        this.total = total;
        this.rows = rows;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public List<T> getRows() {
        return rows;
    }

    public void setRows(List<T> rows) {
        this.rows = rows;
    }
}
