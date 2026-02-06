import axios from "axios";

export type GrantStatusResponse = {
  grant: {
    _id: string;
    sponsorProfileId: string;
    courseId: string;
    seatsPurchased: number;
    seatsUsed: number;
    status: string;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  seatsRemaining: number;
};

export type Enrollment = {
  _id: string;
  userId: string;
  courseId: string;
  grantId: string;
  status: "active" | "revoked";
  assignedAt: string;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getGrantStatus(grantId: string) {
  const { data } = await axios.get<GrantStatusResponse>(
    `/api/sponsorships/grants/${grantId}/status`,
  );
  return data;
}

export async function getGrantEnrollments(grantId: string) {
  const { data } = await axios.get<{ enrollments: Enrollment[] }>(
    `/api/sponsorships/grants/${grantId}/enrollments`,
  );
  return data.enrollments;
}

export async function assignSeat(grantId: string, userId: string) {
  const { data } = await axios.post(
    `/api/sponsorships/grants/${grantId}/assign`,
    { userId },
  );
  return data as {
    sponsoredEnrollment: Enrollment;
    grant: GrantStatusResponse["grant"];
  };
}

export async function revokeEnrollment(enrollmentId: string) {
  const { data } = await axios.post(
    `/api/sponsorships/enrollments/${enrollmentId}/revoke`,
  );
  return data as {
    sponsoredEnrollment: Enrollment;
    grant: GrantStatusResponse["grant"] | null;
  };
}
