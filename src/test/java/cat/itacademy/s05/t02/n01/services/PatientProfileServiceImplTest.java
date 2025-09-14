package cat.itacademy.s05.t02.n01.services;

import cat.itacademy.s05.t02.n01.model.PatientProfile;
import cat.itacademy.s05.t02.n01.repositories.PatientProfileRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;

import static org.junit.jupiter.api.Assertions.*;

class PatientProfileServiceImplTest {

    @Test
    void findById_not_found_throws_404() {
        PatientProfileRepository repo = Mockito.mock(PatientProfileRepository.class);
        PatientProfileServiceImpl svc = new PatientProfileServiceImpl(repo);
        Mockito.when(repo.findById(99L)).thenReturn(Mono.empty());
        assertThrows(ResponseStatusException.class, () -> svc.findById(99L).block());
    }

    @Test
    void save_returns_entity() {
        PatientProfileRepository repo = Mockito.mock(PatientProfileRepository.class);
        PatientProfileServiceImpl svc = new PatientProfileServiceImpl(repo);
        PatientProfile p = PatientProfile.builder().id(1L).firstName("Ana").build();
        Mockito.when(repo.save(p)).thenReturn(Mono.just(p));
        PatientProfile saved = svc.save(p).block();
        assertEquals(1L, saved.getId());
    }
}

