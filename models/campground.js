const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema(
    {
        title: String,
        images: [
            {
                url: String,
                filename: String,
            },
        ],
        price: Number,
        description: String,
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        location: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },
    opts
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `
        <div style="font-family: sans-serif; font-size: 14px; line-height: 1.5;">
            <strong><a href="/campgrounds/${
                this._id
            }" style="color: #0077cc; text-decoration: none;">${this.title}</a></strong><br>
            <em>${this.location}</em><br>
            ${
                this.price
                    ? `<strong>Price:</strong> $${this.price}/night<br>`
                    : ""
            }
            ${
                this.description
                    ? `<p style="margin: 4px 0;">${this.description.substring(
                          0,
                          50
                      )}...</p>`
                    : ""
            }
        </div>
    `;
});

campgroundSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            },
        });
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);
