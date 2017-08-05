/**
 * Created by nhnent on 2017. 8. 6..
 */

function RecognizerSetup(SDK, recognitionMode, language, format, subscriptionKey) {
    let recognizerConfig = new SDK.RecognizerConfig(
        new SDK.SpeechConfig(
            new SDK.Context(
                new SDK.OS(navigator.userAgent, "Browser", null),
                new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
        recognitionMode, // SDK.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation)
        language, // Supported laguages are specific to each recognition mode. Refer to docs.
        format); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)

    // Alternatively use SDK.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback) for token auth
    let authentication = new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);

    return SDK.CreateRecognizer(recognizerConfig, authentication);
}

function RecognizerStart(recognizer, success) {
    recognizer.Recognize((event) => {
        switch (event.Name) {
            case "SpeechHypothesisEvent" :
                success(event.Result.Text);
                break;
            case "RecognitionEndedEvent" :
                RecognizerStart(recognizer, success);
                break;
        }
    }).On(() => {
            // The request succeeded. Nothing to do here.
        },
        (error) => {
            console.error(error);
        });;
}

function RecognizerStop(SDK, recognizer) {
    // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
    recognizer.AudioSource.TurnOff();
}




function init(callback) {
    var recognize, recognize2;
    requireAmd(["Speech.Browser.Sdk"], (SDK) => {
        recognize = RecognizerSetup(SDK, SDK.RecognitionMode.Interactive, 'en-US', 'Simple', '69971df45fcf4deab367f459badab817');
        RecognizerStart(recognize, callback)

        setTimeout(function() {
            recognize2 = RecognizerSetup(SDK, SDK.RecognitionMode.Interactive, 'en-US', 'Simple', '232b3c2d5d6848f392b573aa1d6628f7');
            RecognizerStart(recognize2, callback)
        }, 2500);
    })
}

export {init, RecognizerStart, RecognizerStop};