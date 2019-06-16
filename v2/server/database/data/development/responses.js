const Response = require('./../../models/Response');
const Session = require('./../../models/Session');
const User = require('./../../models/User');

const { sessionTypes, surveyTypes } = require('./../../DBConstants');

module.exports = async () => {
  const type1Session = await Session.find({ type: sessionTypes[0] });
  const type2Session = await Session.findOne({ type: sessionTypes[1] });
  const trainTrainersSession = await Session.findOne({
    type: sessionTypes[4],
  });

  const trainers = await User.find({ role: 'trainer' });
  const localLead = await User.findOne({ role: 'localLead' });

  const responses = [
    // type 1 session
    {
      PIN: 'HIO13',
      trainers: [trainers[0], trainers[1]],
      surveyType: 'pre-day-1',
      session: type1Session[0],
    },
    {
      PIN: 'RAM14',
      trainers: [trainers[0], trainers[1]],
      surveyType: 'pre-day-1',
      session: type1Session[0],
    },
    // post day 1
    {
      PIN: 'RAM15',
      trainers: [trainers[0], trainers[1]],
      surveyType: 'post-day-1',
      session: type1Session[0],
    },
    {
      PIN: 'RAM16',
      trainers: [trainers[0], trainers[1]],
      surveyType: 'post-day-1',
      session: type1Session[0],
    },
    // post day 2
    {
      PIN: 'RAM17',
      trainers: [trainers[0], trainers[1]],
      surveyType: 'post-day-2',
      session: type2Session,
    },
    // train-trainers session
    // pre survey
    {
      PIN: 'PIV15',
      trainers: [trainers[0], localLead],
      surveyType: surveyTypes[5],
      session: trainTrainersSession,
    },
    {
      PIN: 'SLU23',
      trainers: [trainers[0], localLead],
      surveyType: surveyTypes[5],
      session: trainTrainersSession,
    },
    // post survey
    {
      PIN: 'SLU24',
      trainers: [trainers[0], localLead],
      surveyType: surveyTypes[6],
      session: trainTrainersSession,
    },
  ];

  return Response.create(responses);
};
