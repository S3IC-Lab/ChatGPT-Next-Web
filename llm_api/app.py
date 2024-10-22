from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from vllm import LLM, SamplingParams
import torch
from transformers import AutoTokenizer
import os
# os.environ['CUDA_VISIBLE_DEVICES'] = '0,1'
# os.environ['CUDA_VISIBLE_DEVICES'] = '2,3'
# os.environ['CUDA_VISIBLE_DEVICES'] = '4,5'
os.environ['CUDA_VISIBLE_DEVICES'] = '6,7'
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 可以指定允许的域名列表，例如 ["http://localhost", "http://example.com"]
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法
    allow_headers=["*"],  # 允许所有请求头
)
torch.set_float32_matmul_precision('high')
# Model path
# model_path = "/home/chuokun_xu/model/Llama-2-7b-chat-hf" # 8001
# model_path = "/home/chuokun_xu/model/alpaca-13b" # 8002
# model_path = "/home/chuokun_xu/model/vicuna-13b-1.1" # 8003
model_path = "/home/chuokun_xu/model/Llama-2-13b-hf" # 8004
# Check available GPU count
tensor_parallel_size = min(torch.cuda.device_count(), 2)  # Using two GPUs

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_path)

# Load model using vLLM with tensor parallelism and mixed precision
model = LLM(model=model_path, tensor_parallel_size=tensor_parallel_size, dtype=torch.float16, )

# Request body, allowing additional parameters to control generation
class RequestData(BaseModel):
    prompt: str

# Response body
class ResponseData(BaseModel):
    completion: str

# API endpoint for text generation
@app.post("/v1/completions", response_model=ResponseData)
async def get_completion(data: RequestData):
    # Prepare sampling parameters
    sampling_params = SamplingParams(
        max_tokens=50,
        # temperature=1.0,
        # top_p=1.0,
        # top_k=50,
    )

    # Run inference
    output = model.generate(data.prompt, sampling_params)
    completion_text = output[0].outputs[0].text

    return ResponseData(completion=completion_text)
