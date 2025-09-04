import zod from 'zod';

const createAudio = zod.object({
    idioma: zod.string().min(1, "El idioma es requerido"),
    video_id: zod.string().min(1, "El ID del video es requerido").transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), {
        message: "El ID del video debe ser un número entero positivo",
    }),
})

const updateAudio = zod.object({
    idioma: zod.string().min(1, "El idioma es requerido"),
});

export function validateAudio(data) {
    return createAudio.safeParse(data);
}

export function validateAudioUpdate(data) {
    return updateAudio.safeParse(data);
}