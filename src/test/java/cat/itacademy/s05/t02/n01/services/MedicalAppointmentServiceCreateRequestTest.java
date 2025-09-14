package cat.itacademy.s05.t02.n01.services;

import cat.itacademy.s05.t02.n01.dto.CreateAppointmentRequestPublic;
import cat.itacademy.s05.t02.n01.enums.CoverageType;
import cat.itacademy.s05.t02.n01.mapper.AppointmentMapper;
import cat.itacademy.s05.t02.n01.model.MedicalAppointment;
import cat.itacademy.s05.t02.n01.repositories.MedicalAppointmentRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

class MedicalAppointmentServiceCreateRequestTest {

    @Test
    void insurance_without_healthInsurance_returns_bad_request() {
        MedicalAppointmentRepository repo = Mockito.mock(MedicalAppointmentRepository.class);
        AppointmentMapper mapper = Mockito.mock(AppointmentMapper.class);
        MedicalAppointmentService svc = new MedicalAppointmentService(repo, mapper);

        CreateAppointmentRequestPublic req = new CreateAppointmentRequestPublic(
                null, null, null, null, null,
                CoverageType.INSURANCE, null,
                null, null, null, null, null
        );

        StepVerifier.create(svc.createRequest(req))
                .expectErrorSatisfies(err -> {
                    assert err instanceof ResponseStatusException;
                    ResponseStatusException ex = (ResponseStatusException) err;
                    assert ex.getStatusCode().value() == HttpStatus.BAD_REQUEST.value();
                })
                .verify();
    }

    @Test
    void creates_request_successfully() {
        MedicalAppointmentRepository repo = Mockito.mock(MedicalAppointmentRepository.class);
        AppointmentMapper mapper = Mockito.mock(AppointmentMapper.class);
        MedicalAppointmentService svc = new MedicalAppointmentService(repo, mapper);

        CreateAppointmentRequestPublic req = new CreateAppointmentRequestPublic(
                null, null, null, null, null,
                CoverageType.PRIVATE, null,
                "first","last","mail","000","subject"
        );

        MedicalAppointment entity = new MedicalAppointment();
        Mockito.when(mapper.toEntityFromPublicRequest(Mockito.any())).thenReturn(entity);
        Mockito.when(repo.save(entity)).thenReturn(Mono.just(entity));
        Mockito.when(mapper.toResponse(entity)).thenReturn(new cat.itacademy.s05.t02.n01.dto.AppointmentResponse(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null));

        StepVerifier.create(svc.createRequest(req))
                .expectNextCount(1)
                .verifyComplete();
    }
}

