importScripts("./HelloWasm.js")

Module.onRuntimeInitialized = () => {

    // Global variables
    let INPUT_MATRIX_BYTES = Module.getInputMatrixBytes()
    let OUTPUT_MATRIX_BYTES = Module.getOutputMatrixBytes()
    let NCOMP = 0 // The number of components is index by zero (zero = 1)

    self.onmessage = (e) => {
        switch (e.data.action) {
            case "start":

                let frame = new Uint8ClampedArray(e.data.transferFrame);

                INPUT_MATRIX_BYTES.set(frame)
                Module.svdImage(NCOMP)
                frame.set(OUTPUT_MATRIX_BYTES)

                self.postMessage({type: "test", frame}, [frame.buffer]);

                break;
            case "updateNcomp":
                NCOMP = e.data.ncomp
                break;
        }
    }

}
