# Harvest Predictor — Improvements Needed for a Real Agriculture App

This document describes the improvements needed to evolve the current React Native + Expo prototype into a reliable production agriculture application for farmers.

The current app already provides:

- Home, location, crop, land/season, farming information, and result screens.
- English and Kinyarwanda support.
- Season-aware planting month selection.
- Saved predictions using AsyncStorage.
- Responsive farmer-facing UI.
- Mock harvest prediction calculations.

The recommendations below preserve the existing functional flow while adding real data, reliability, security, and agricultural value.

## 1. Replace mock prediction values with a real model

The current prediction service uses fixed mock values. A real prediction should consider:

- Crop.
- Province and district.
- Agricultural season.
- Planting month.
- Land size.
- Soil type.
- Soil fertility.
- Rainfall.
- Temperature.
- Fertilizer use.
- Improved seed use.
- Irrigation.
- Previous crop.
- Planting density.
- Historical crop yield.

Recommended architecture:

```text
React Native app
        ↓
Backend API
        ↓
Prediction service/model
        ↓
Database containing crop, weather, soil, and regional data
```

The mobile app should not contain the final production model. Keep the model on a secure backend so it can be updated without releasing a new mobile app version.

The model should return:

- Expected harvest.
- Low and high estimate.
- Confidence level.
- Main factors affecting the prediction.
- Model/data update date.

Do not present uncertain predictions as guaranteed harvests.

## 2. Use official and trustworthy agricultural data

Prediction quality depends on the quality of the data. Collect or integrate:

- Rwanda agricultural yield data.
- Seasonal Agricultural Survey data.
- Crop production by district.
- Historical rainfall.
- Historical temperature.
- Soil information.
- Agricultural research data.
- Agronomist-reviewed crop coefficients.

Every data source should have:

- Source name.
- Collection date.
- Geographic coverage.
- Crop coverage.
- Data quality notes.

Do not use unverified numbers in a production prediction system.

## 3. Add a backend API

The current app should eventually communicate with a backend for:

- Predictions.
- Farmer accounts.
- Saved predictions.
- Weather data.
- Market prices.
- Notifications.
- Advisory content.
- Feedback and actual harvest results.

Possible backend choices:

- FastAPI or Node.js/Express.
- PostgreSQL database.
- REST API initially.
- JWT or phone-based authentication.
- HTTPS for all communication.

Recommended endpoints:

```text
POST   /auth/request-otp
POST   /auth/verify-otp
GET    /profile
PUT    /profile
POST   /predictions
GET    /predictions
GET    /predictions/:id
DELETE /predictions/:id
GET    /weather/:district
GET    /market-prices
GET    /advisories
POST   /feedback/actual-harvest
```

Validate all input again on the backend. Never trust only mobile-app validation.

## 4. Add farmer accounts

AsyncStorage is useful for a prototype, but it does not provide account recovery or multi-device access.

Add:

- Phone number registration.
- OTP verification.
- Optional PIN login.
- Farmer profile.
- Farm profile.
- Cloud-saved predictions.
- Account recovery.
- Account deletion.
- Logout from the current device.

Do not make registration mandatory before allowing a quick prediction. A good flow is:

```text
Quick prediction → Result → Optional account creation to save online
```

## 5. Build an offline-first synchronization system

Rural users may have unreliable or expensive internet. The app should work without a connection.

Expected behavior:

1. The farmer enters a prediction.
2. The app saves the input locally.
3. The app displays the result immediately when possible.
4. The app queues data for synchronization.
5. The app synchronizes when internet returns.

Show clear sync states:

```text
Saved on this phone
Waiting to sync
Synced
Sync failed — tap to retry
```

Add:

- Local database or structured local storage.
- Pending-operation queue.
- Retry with exponential backoff.
- Last synchronization time.
- Manual “Sync now” action.
- Conflict handling.
- Duplicate prevention.
- Data migration for existing AsyncStorage predictions.

Keep AsyncStorage as a cache if desired, but use a more structured local data layer as the app grows.

## 6. Add weather and rainfall information

Weather can improve both predictions and recommendations.

Useful information includes:

- Rainfall forecast.
- Rainfall history.
- Temperature.
- Dry-spell risk.
- Heavy-rain risk.
- Planting suitability.
- Expected weather during harvest.

Example farmer message:

```text
Planting advice:
Rain is expected during the next 10 days.

Risk:
A dry period may occur after planting.

Recommendation:
Prepare irrigation or consider the recommended planting window.
```

Weather data should be cached locally and display its last updated time.

## 7. Add soil and farm information

Add optional advanced information after the basic prediction flow:

- Soil type.
- Soil fertility.
- Farm slope.
- Altitude.
- Irrigation availability.
- Previous crop.
- Organic fertilizer use.
- Chemical fertilizer use.
- Pest pressure.
- Erosion-control practices.

Do not make every field mandatory. Keep the quick flow simple and allow advanced information to improve accuracy.

## 8. Improve the result screen

The result should help the farmer make a decision, not only show a number.

Add:

- Expected harvest.
- Conservative estimate.
- Optimistic estimate.
- Confidence level.
- Main factors affecting the result.
- Suggested planting window.
- Weather risk.
- Fertilizer reminder.
- Harvest preparation date.
- Storage recommendation.
- Market preparation suggestion.

Example:

```text
Expected harvest: 21.9 tonnes
Likely range: 17.5–26.3 tonnes
Confidence: Medium

What may improve your result:
- Use improved seed.
- Plant during the recommended window.
- Apply suitable fertilizer.
- Monitor rainfall after planting.
```

Keep the estimate disclaimer visible:

```text
Iki ni ikigereranyo gusa, si umusaruro wizewe.
```

## 9. Add crop and disease advisory content

Create a farmer knowledge section containing:

- Crop planting guides.
- Fertilizer guidance.
- Pest identification.
- Disease symptoms.
- Weed management.
- Harvest timing.
- Storage advice.
- Erosion-control methods.
- Climate-risk advice.

Start with short text, icons, and images. Use simple Kinyarwanda and English.

Future feature:

```text
Take a crop-leaf photo
        ↓
Detect possible disease
        ↓
Show likely causes and approved guidance
```

Disease advice must be reviewed by qualified agronomists before publication.

## 10. Add local market information

Farmers need to understand the possible value of their harvest.

Add:

- Market prices by district.
- Price trends.
- Buyer or collection-center locations.
- Transport distance.
- Estimated revenue.
- Estimated production cost.
- Estimated profit or margin.
- Price update date.

Example:

```text
Expected harvest: 2.4 tonnes
Estimated price: 480 RWF/kg
Estimated revenue: 1,152,000 RWF
Estimated costs: 520,000 RWF
Estimated margin: 632,000 RWF
```

Never show fabricated market prices. Use a verified provider and show when the price was last updated.

## 11. Add reminders and notifications

Useful reminders include:

- Planting date.
- Fertilizer application.
- Weeding.
- Pest monitoring.
- Harvest period.
- Weather warning.
- Prediction synchronization failure.

Start with local notifications. Add remote push notifications later when the backend and device testing are ready.

Example:

```text
Your Season B planting window starts in 5 days.
```

## 12. Improve location selection

The current manual province and district selection should remain available.

Optional future GPS support can:

- Suggest the current province and district.
- Allow manual correction.
- Work only after user permission.
- Avoid collecting background location.
- Store approximate location when possible.

Never require GPS for the basic prediction flow.

## 13. Improve validation and error handling

Validate:

- Land size.
- Decimal formatting.
- Extremely large land values.
- Missing crop.
- Missing province or district.
- Missing season.
- Invalid season/month combination.
- Unsupported agricultural year.
- Missing farming information.
- Legacy saved prediction records.
- Network failure.
- Server timeout.

Use short, friendly messages in both languages. Show errors near the field and keep the entered values.

## 14. Improve accessibility and low-literacy support

Add:

- Large touch targets.
- Screen-reader labels.
- Good color contrast.
- Icons with text labels.
- Short paragraphs.
- Examples beside difficult fields.
- Optional audio instructions.
- Text-to-speech for result summaries.
- Crop illustrations.
- Clear progress indicators.

Do not use icons or color alone to communicate important information.

## 15. Add analytics carefully

Useful product analytics:

- Screen abandonment.
- Crop selections.
- Language selection.
- Validation errors.
- Prediction completion time.
- Saved prediction usage.
- Offline synchronization failures.
- Weather/advisory usage.

Avoid collecting personal information unless it is necessary and consented to. Do not log farmer names, phone numbers, exact locations, credentials, or full farm data in production logs.

## 16. Add an agronomist/admin dashboard

Administrators should be able to:

- Add or update crops.
- Update crop coefficients.
- Update provinces and districts.
- Publish advisory content.
- Update translations.
- Review prediction quality.
- View usage statistics.
- Review farmer feedback.
- Manage model versions.
- Disable incorrect content quickly.

Content should be configurable without requiring a new mobile release for every wording or advisory change.

## 17. Collect actual harvest feedback

After the harvest period, ask the farmer:

```text
What was your actual harvest?
```

Store:

- Original prediction.
- Actual harvest.
- Crop.
- District.
- Season.
- Planting month.
- Farming inputs.
- Weather context.

Use this to calculate:

- Mean absolute error.
- Error by crop.
- Error by district.
- Error by season.
- Error by farm size.

Use feedback to improve the model, but get clear consent before using farmer data for model training.

## 18. Add security and privacy before production

Before public release:

- Use HTTPS only.
- Never store API secrets in the mobile app.
- Validate all requests on the backend.
- Secure authentication tokens.
- Encrypt sensitive data.
- Add account deletion.
- Add a privacy policy.
- Add consent for analytics and location.
- Rate-limit API requests.
- Back up the database.
- Avoid personal data in logs.
- Add secure error reporting.
- Define data retention rules.

## 19. Add testing and release quality gates

### Device testing

- Narrow Android phone.
- Low-memory Android phone.
- Current supported Android versions.
- Slow network.
- No network.
- Long Kinyarwanda text.
- Keyboard open.
- Large district and province labels.
- Small screen width.

### Functional testing

- New prediction.
- Saved prediction.
- Delete prediction.
- Language switching.
- Legacy saved prediction.
- Season A crossing calendar years.
- Invalid month selection.
- Offline operation.
- Server unavailable.
- App restart.
- Data synchronization.

### User testing

Test with real farmers and agronomists in more than one district. Verify that users understand:

- Igihembwe.
- Hegitari.
- Umusaruro kuri hegitari.
- The harvest range.
- The disclaimer.
- The difference between agricultural year and calendar year.

## 20. Recommended implementation phases

### Phase 1 — Production foundation

1. Backend API.
2. PostgreSQL database.
3. Farmer account system.
4. Offline synchronization queue.
5. Server-side prediction endpoint.
6. Error monitoring.
7. Privacy policy.

### Phase 2 — Better agricultural intelligence

1. Official Rwanda agricultural datasets.
2. Weather integration.
3. Soil and farm profile.
4. Better confidence ranges.
5. Actual harvest feedback.
6. Model monitoring.

### Phase 3 — Farmer assistance

1. Planting reminders.
2. Fertilizer and disease advice.
3. Market prices.
4. Audio guidance.
5. Agronomist-reviewed content.
6. Admin dashboard.

### Phase 4 — Scale and partnerships

1. Farmer cooperatives.
2. Agronomists.
3. Agriculture data partners.
4. Input suppliers.
5. Buyers and market centers.
6. SMS or USSD fallback.
7. Support for additional countries and languages.

## 21. Highest-value next three features

If development capacity is limited, implement these first:

1. **Offline synchronization with a backend** so farmers do not lose their data.
2. **Weather-aware prediction and advice** so results become more useful for planting decisions.
3. **Actionable recommendations after the result** so the app tells farmers what they can do next.

These changes provide the strongest path from a UI prototype to a genuinely useful farmer product.
