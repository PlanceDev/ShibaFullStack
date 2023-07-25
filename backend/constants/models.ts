export const sdModelsDiffusers = [
  {
    displayName: 'Real',
    steps: 25,
    width: 512,
    height: 512,
    cfg_scale: 12,
    styleImg:
      'https://lfgdlxxyhvkgzhgoocbq.supabase.co/storage/v1/object/public/images/avatars/rev.jpg',
  },
  {
    displayName: 'Anime',
    steps: 25,
    width: 512,
    height: 768,
    cfg_scale: 12,
    styleImg:
      'https://lfgdlxxyhvkgzhgoocbq.supabase.co/storage/v1/object/public/images/avatars/rev.jpg',
  },
  {
    displayName: 'Dream',
    steps: 25,
    width: 512,
    height: 512,
    cfg_scale: 12,
    styleImg:
      'https://lfgdlxxyhvkgzhgoocbq.supabase.co/storage/v1/object/public/images/avatars/rev.jpg',
  },
  {
    displayName: 'Fantasy',
    steps: 25,
    width: 512,
    height: 512,
    cfg_scale: 12,
    styleImg:
      'https://lfgdlxxyhvkgzhgoocbq.supabase.co/storage/v1/object/public/images/avatars/rev.jpg',
  },
  // More entries...
];

export const SDmodelMappingDiffuser: Record<
  string,
  {
    model: string;
    steps: number;
    width: number;
    height: number;
    promptAppended: string;
    qr_size: number;
    cfg_scale: number;
    weight_list: number[];
    scheduler_name: string;
    multicontrolnet: number;
    negativePromptAppended: string;
    denoising_strength: number;
  }
> = {
  Real: {
    model: 'cyberrealistic',
    steps: 25,
    width: 512,
    height: 768,
    promptAppended:
      '(photo, studio lighting, hard light, sony a7, 50 mm, matte skin, pores, colors, hyperdetailed, hyperrealistic,film stock photograph, 4 kodak portra 400, camera f1.6 lens ,rich colors ,hyper realistic, lifelike texture,),(21 year old:1.2),fully clothed,',
    qr_size: 768,
    cfg_scale: 12,
    weight_list: [0.2, 0.3, 0.2],
    scheduler_name: 'DDIM',
    multicontrolnet: 3,
    negativePromptAppended:
      'EasyNegative, badhandv4, mutated hands,text, b&w, illustration, painting, cartoon, 3d, bad art, poorly drawn, close up, blurry, disfigured, deformed, extra limbs,',
    denoising_strength: 0.3,
  },
  Anime: {
    model: 'coffeemix',
    steps: 25,
    width: 512,
    height: 768,
    promptAppended: 'beautiful(masterpiece, best quality), 1girl, pretty face,',
    qr_size: 768,
    cfg_scale: 12,
    weight_list: [0.2, 0.3, 0.2],
    scheduler_name: 'DDIM',
    multicontrolnet: 3,
    negativePromptAppended:
      'EasyNegative mutated hands, poorly drawn eyes, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, incoherent,',
    denoising_strength: 0.3,
  },
  Dream: {
    model: 'dreamshaper',
    steps: 25,
    width: 512,
    height: 768,
    promptAppended:
      'beautiful((best quality)), ((masterpiece)), (detailed), art trending on Artstation 8k HD high definition detailed realistic, detailed, hyper detailed,  best quality, ultra high res, high resolution, detailed, raw photo, sharp ',
    qr_size: 768,
    cfg_scale: 12,
    weight_list: [0.2, 0.3, 0.2],
    scheduler_name: 'DDIM',
    multicontrolnet: 3,
    negativePromptAppended:
      'EasyNegative mutated hands, poorly drawn eyes, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, incoherent,',
    denoising_strength: 0.3,
  },
  Fantasy: {
    model: 'revanimated',
    steps: 25,
    width: 512,
    height: 768,
    promptAppended:
      'beautiful((best quality)), ((masterpiece)), (detailed), art trending on Artstation 8k HD high definition detailed realistic, detailed, hyper detailed,  best quality, ultra high res, high resolution, detailed, raw photo, sharp ',
    qr_size: 768,
    cfg_scale: 12,
    weight_list: [0.2, 0.3, 0.2],
    scheduler_name: 'DDIM',
    multicontrolnet: 3,
    negativePromptAppended:
      'EasyNegative mutated hands, poorly drawn eyes, mutation, deformed, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck, incoherent,',
    denoising_strength: 0.3,
  },
};
