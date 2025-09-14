package cat.itacademy.s05.t02.n01.services;

import cat.itacademy.s05.t02.n01.dto.ProfessionalProfileRequest;
import cat.itacademy.s05.t02.n01.dto.ProfessionalProfileResponse;
import cat.itacademy.s05.t02.n01.model.ProfessionalProfile;
import cat.itacademy.s05.t02.n01.repositories.ProfessionalProfileRepository;
import cat.itacademy.s05.t02.n01.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import reactor.core.publisher.Mono;

import static org.junit.jupiter.api.Assertions.*;

class ProfessionalProfileServiceTest {

    @Test
    void upsert_creates_when_absent() {
        ProfessionalProfileRepository repo = Mockito.mock(ProfessionalProfileRepository.class);
        UserRepository users = Mockito.mock(UserRepository.class);
        ProfessionalProfileService svc = new ProfessionalProfileService(repo, users);

        Mockito.when(repo.findByUserId(77L)).thenReturn(Mono.empty());
        Mockito.when(repo.save(Mockito.any(ProfessionalProfile.class))).thenAnswer(inv -> Mono.just(inv.getArgument(0)));

        ProfessionalProfileRequest req = new ProfessionalProfileRequest("Ana","García","Medicina","CARDIOLOGY","Bio","/img.jpg");
        ProfessionalProfileResponse resp = svc.upsert(77L, req).block();

        assertNotNull(resp);
        assertEquals("Ana", resp.firstName());
        assertEquals("García", resp.lastName());
        assertEquals("/img.jpg", resp.photoUrl());
    }
}

