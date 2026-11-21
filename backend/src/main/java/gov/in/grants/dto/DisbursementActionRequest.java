package gov.in.grants.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DisbursementActionRequest {
    private String paymentStatus; // DISBURSED, ON_HOLD, FAILED
    private String utrNumber;
    private LocalDate disbursedDate;
    private String remarks;

    public DisbursementActionRequest() {}

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getUtrNumber() { return utrNumber; }
    public void setUtrNumber(String utrNumber) { this.utrNumber = utrNumber; }

    public LocalDate getDisbursedDate() { return disbursedDate; }
    public void setDisbursedDate(LocalDate disbursedDate) { this.disbursedDate = disbursedDate; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
