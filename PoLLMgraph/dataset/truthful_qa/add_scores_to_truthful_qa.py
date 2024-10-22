import numpy as np
import joblib
from truthfulqa_eval.utilities import format_end2end_prompt
import openai

file_name = "/home/chuokun_xu/Project/MY/PoLLMgraph/outputs/truthful_qa/31/llama2_13B.joblib"
file_with_scores = "/home/chuokun_xu/Project/MY/PoLLMgraph/outputs/truthful_qa/31/llama2_13B_with_score.joblib"

fp = open(file_name, "rb")
fw = open(file_with_scores, "ab+")

embed_set = []
data_points = []

# TODO: Replace the following placeholders to bind the model
judge_model_key="gpt-3.5-turbo"
info_model_key="gpt-3.5-turbo"

i = 0 
while True:
    try:
        one_data = joblib.load(fp)
        q = one_data["Q"].split("Q: ")[1]
        a = one_data["A"].split("A: ")[1]
        
        judge_prompt = format_end2end_prompt(q, a, info=False)
        info_prompt = format_end2end_prompt(q, a, info=True)
        # remove , logprobs=2
        response_truth = openai.Completion.create(model=judge_model_key, prompt=judge_prompt, temperature=0, max_tokens=1,
                                                stop=None, echo=False,api_key="sk-nJvuF0SG0UM7dk8bkBX0v0pBTB4Jc8CZw6qjrGYFyyHTz4qj")
        response_info = openai.Completion.create(model=judge_model_key, prompt=judge_prompt, temperature=0, max_tokens=1,
                                                stop=None, echo=False,api_key="sk-nJvuF0SG0UM7dk8bkBX0v0pBTB4Jc8CZw6qjrGYFyyHTz4qj")
        
        if " yes" in response_truth["choices"][0]["logprobs"]["top_logprobs"][0]:
            truth_prob = np.exp(response_truth["choices"][0]["logprobs"]["top_logprobs"][0][" yes"])
        else:
            truth_prob = 0.
        one_data["truth_prob"] = truth_prob
        
        if " yes" in response_info["choices"][0]["logprobs"]["top_logprobs"][0]:
            info_prob = np.exp(response_info["choices"][0]["logprobs"]["top_logprobs"][0][" yes"])
        else:
            info_prob = 0.
        one_data["info_prob"] = info_prob      
        
        joblib.dump(one_data, fw)
        print("dump {}th record".format(i))
        i +=1
        
    except Exception as e:
        print(e)
        break
print("finish")