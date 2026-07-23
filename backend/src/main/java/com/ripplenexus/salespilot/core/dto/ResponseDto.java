package com.ripplenexus.salespilot.core.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResponseDto<T> {

    private boolean success;
    private String message;
    private T data;
    private Object errors;

    @Builder.Default
    private Instant timestamp = Instant.now();

    public ResponseDto(boolean success, String message, T data, Object errors, Instant timestamp) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.errors = errors;
        this.timestamp = timestamp != null ? timestamp : Instant.now();
    }

    public static <T> ResponseDto<T> success(T data) {
        return new ResponseDto<>(true, null, data, null, Instant.now());
    }

    public static <T> ResponseDto<T> success(String message, T data) {
        return new ResponseDto<>(true, message, data, null, Instant.now());
    }

    public static <T> ResponseDto<T> error(String message) {
        return new ResponseDto<>(false, message, null, null, Instant.now());
    }

    public static <T> ResponseDto<T> error(String message, Object errors) {
        return new ResponseDto<>(false, message, null, errors, Instant.now());
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
    public Object getErrors() { return errors; }
    public void setErrors(Object errors) { this.errors = errors; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
