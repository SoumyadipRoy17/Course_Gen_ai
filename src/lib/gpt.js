import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function strict_output_gemini(
  system_prompt,
  user_prompt,
  output_format,
  default_category = "",
  output_value_only = false,
  model = "gemini-1.5-flash",
  temperature = 1,
  num_tries = 3,
  verbose = false
) {
  const list_input = Array.isArray(user_prompt);
  const dynamic_elements = /<.*?>/.test(JSON.stringify(output_format));
  const list_output = /\[.*?\]/.test(JSON.stringify(output_format));

  let error_msg = "";

  const modelInstance = genAI.getGenerativeModel({ model });

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt = `\nYou are to output ${
      list_output ? "an array of objects in" : ""
    } the following in json format: ${JSON.stringify(
      output_format
    )}. \nDo not put quotation marks or escape character \\ in the output fields.`;

    if (list_output) {
      output_format_prompt += `\nIf output field is a list, classify output into the best element of the list.`;
    }

    if (dynamic_elements) {
      output_format_prompt += `\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}`;
    }

    if (list_input) {
      output_format_prompt += `\nGenerate an array of json, one json for each input element.`;
    }

    const fullPrompt = `${system_prompt}${output_format_prompt}${error_msg}\n\n${
      list_input ? user_prompt.join("\n") : user_prompt
    }`;

    try {
      const result = await modelInstance.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature,
        },
      });

      let res = result.response.text();
      res = res.replace(/'/g, '"').replace(/(\w)"(\w)/g, "$1'$2");

      // Remove markdown code fences like ```json ... ```
      res = res.replace(/```(?:json)?\n?([\s\S]*?)```/, "$1").trim();

      // Optional cleanup for single quotes or bad escapes
      res = res.replace(/'/g, '"').replace(/(\w)"(\w)/g, "$1'$2");

      if (verbose) {
        console.log("System prompt:", fullPrompt);
        console.log("GPT response:", res);
      }

      let output = JSON.parse(res);

      if (list_input && !Array.isArray(output)) {
        throw new Error("Output format not in an array of json");
      }

      if (!list_input) output = [output];

      for (let index = 0; index < output.length; index++) {
        for (const key in output_format) {
          if (/<.*?>/.test(key)) continue;

          if (!(key in output[index])) {
            throw new Error(`${key} not in json output`);
          }

          if (Array.isArray(output_format[key])) {
            const choices = output_format[key];
            if (Array.isArray(output[index][key])) {
              output[index][key] = output[index][key][0];
            }
            if (!choices.includes(output[index][key]) && default_category) {
              output[index][key] = default_category;
            }
            if (
              typeof output[index][key] === "string" &&
              output[index][key].includes(":")
            ) {
              output[index][key] = output[index][key].split(":")[0];
            }
          }
        }

        if (output_value_only) {
          output[index] = Object.values(output[index]);
          if (output[index].length === 1) {
            output[index] = output[index][0];
          }
        }
      }

      return list_input ? output : output[0];
    } catch (e) {
      error_msg = `\n\nResult: ${e.message}\n\nError message: ${e}`;
      console.log("An exception occurred:", e.message);
    }
  }

  return [];
}
