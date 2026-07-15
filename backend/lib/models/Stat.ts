import mongoose, { Schema, Document } from 'mongoose'

export interface IStatItem extends Document {
    id: string
    label: string
    number: string
    order: number
}

export interface IStatsData extends Document {
    id: string
    items: IStatItem[]
}

const StatItemSchema = new Schema<IStatItem>({
    label: { type: String, required: true },
    number: { type: String, required: true },
    order: { type: Number, default: 0 }
}, {
    timestamps: false,
    toJSON: {
        transform: function(doc, ret: any) {
            ret.id = ret._id.toString()
            delete ret._id
            delete ret.__v
            return ret
        }
    }
})

const StatsDataSchema = new Schema<IStatsData>({
    items: { type: [StatItemSchema], default: [] }
}, {
    timestamps: false,
    toJSON: {
        transform: function(doc, ret: any) {
            ret.id = ret._id.toString()
            delete ret._id
            delete ret.__v
            return ret
        }
    }
})

export const StatItem = mongoose.models.StatItem || mongoose.model<IStatItem>('StatItem', StatItemSchema)
export default mongoose.models.StatsData || mongoose.model<IStatsData>('StatsData', StatsDataSchema)

