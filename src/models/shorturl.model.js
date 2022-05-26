const randomstring = require('randomstring');
const { isWebUri } = require('valid-url');

module.exports = function (app) {
  const modelName = 'shorturl';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      url: {
        type: String,
        required: true,
        validate: {
          validator(val) {
            return !!isWebUri(val);
          },
          message: (props) => `${props.value} is not a valid URL`,
        },
      },
      shortCode: {
        type: String,
        unique: true,
        minLength: 4,
        match: /^[A-Za-z0-9]*$/,
        lowercase: true,
        default() {
          return randomstring.generate({
            length: 6,
            charset: 'alphanumeric',
          });
        },
      },
      user: { type: Schema.Types.ObjectId, ref: 'user' },
      hits: { type: Number, default: 0 },
      lastAccessedAt: { type: Date },
      name: { type: String },
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
