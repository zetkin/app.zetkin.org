import mongoose from 'mongoose';

type PbxConfigModelType = {
  orgId: number;
  url: string;
};

const pbxConfigSchema = new mongoose.Schema<PbxConfigModelType>({
  orgId: Number,
  url: String,
});

export const PbxConfigModel: mongoose.Model<PbxConfigModelType> =
  mongoose.models.PbxConfig ||
  mongoose.model<PbxConfigModelType>('PbxConfig', pbxConfigSchema);
