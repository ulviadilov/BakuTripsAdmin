export const QUERY_KEYS = {
    category: "category",
    user: "user",
    contact: "contact",
    groupTour: "groupTour",
    package: "package",
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
};
