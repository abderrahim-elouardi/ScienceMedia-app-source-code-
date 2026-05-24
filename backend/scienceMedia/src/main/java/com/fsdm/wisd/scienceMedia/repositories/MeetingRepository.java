package com.fsdm.wisd.scienceMedia.repositories;

import com.fsdm.wisd.scienceMedia.entite.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
}
