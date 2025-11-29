export const QUERY_KEYS = {
    category: "category",
    user: "user",
    contact: "contact",
    orders: {
        all: ["orders"] as const,
        detail: (id: string) => ["orders", "detail", id] as const,
    },
    blog: {
        all: ["blog"] as const,
    },
    groupTour: "groupTour",
    package: "package",
    partner: {
        all: ["partner"] as const,
    },
    tour: {
        all: ["tour"] as const,
        select: ["select"] as const,
    },
    privateTour: {
        all: ["privateTour"] as const,
        select: ["private-select"] as const,
        packages: ["packages"] as const,
    },
    packageOption: {
        all: ["option"] as const,
        select: ["option-select"] as const,
    },
    packageDailyProgram: {
        all: ["daily-program"] as const,
    },
    destination: {
        all: ["destination"] as const,
        details: () => [...QUERY_KEYS.destination.all, "detail"] as const,
        detail: (id: string) =>
            [...QUERY_KEYS.destination.details(), id] as const,
    },
    promoCode: {
        all: ["promo-code"] as const,
    },
    slider: {
        all: ["slider"] as const,
    },
    customPlace: {
        all: ["custom-places"] as const,
        detail: (id: string) => ["custom-places", "detail", id] as const,
    },
    member: {
        all: ["member"] as const,
    },
    guide: {
        all: ["guide"] as const,
    },
    profile: ["profile"] as const,
};
