import e, { Request, Response } from 'express';
import Image from '../models/Image';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { SDmodelMappingDiffuser, sdModelsDiffusers } from '../constants/models';

// @route   POST api/image/
// @desc    Upload image to mongodb
// @access  Public
export const saveImage = async (req: Request, res: Response) => {
  try {
    const { prompt, modelName } = req.body;

    if (!modelName) {
      return res.status(400).send({ error: 'No model name fou1nd' });
    }

    const defaultPrompt = 'Super cute Shiba Inu';

    const sdModel: any = sdModelsDiffusers.find(
      (sdModel: any) => sdModel.displayName === modelName
    );

    const SDmodelData = SDmodelMappingDiffuser[sdModel.displayName as string];
    const negativePromptUser = '';

    let userPrompt = prompt
      .replace('child', '')
      .replace('kid', '')
      .replace('loli', '')
      .replace('underage', '');

    // If userPrompt is an empty string, use defaultPrompt
    if (userPrompt.trim() === '') {
      userPrompt = defaultPrompt;
    }

    const updatedPrompt = userPrompt + ', ' + SDmodelData.promptAppended;
    const negativePrompt =
      negativePromptUser + SDmodelData.negativePromptAppended + ', ';

    const requestBody = {
      prompt: updatedPrompt,
      width: SDmodelData.width || 512,
      height: SDmodelData.height || 512,
      cfg_scale: SDmodelData.cfg_scale || 6,
      steps: SDmodelData.steps || 25,
      negative_prompt: negativePrompt || 'bad quality',
      weight_list: SDmodelData.weight_list || [0.24, 0.24, 0.02],
      model: SDmodelData.model,
      multicontrolnet: SDmodelData.multicontrolnet || 3,
      qr_size: SDmodelData.qr_size || 768,
      scheduler_name: SDmodelData.scheduler_name || 'DDIM',
    };

    let SDresponse;

    try {
      const res = await axios.post(`${process.env.IMG_GEN_API_URI}`, {
        ...requestBody,
      });

      SDresponse = res.data;
    } catch (error) {
      console.log('Error while generating image: ', error);
    }

    return res.status(200).send(SDresponse);
  } catch (error) {
    console.log(error);

    return res.status(500).send('Server error.');
  }
};

export const getImages = async (req: Request, res: Response) => {
  try {
    const images = Image.getImages();
    return res.status(200).send(images);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server error');
  }
};
