# app.py

from fastapi import FastAPI
from pydantic import BaseModel
from vllm import SamplingParams
import torch
import deepspeed
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import json
app = FastAPI()

# 模型路径
model_path = "/home/chuokun_xu/model/Llama-2-13b-hf"

# 检查可用的 GPU 数量
tensor_parallel_size = min(torch.cuda.device_count(), 2)  # 使用两张卡

# 加载 tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_path)

# 使用 DeepSpeed Zero-3 和模型并行加载模型
ds_config = {
    "train_batch_size": 1,
    "zero_optimization": {
        "stage": 3,
        "offload_param": {
            "device": "cpu",
            "pin_memory": True
        },
        "offload_optimizer": {
            "device": "cpu",
            "pin_memory": True
        }
    },
    "tensor_parallel": {
        "enabled": True,
        "tp_size": tensor_parallel_size,
        "tp_gather_partitioned_activations": True
    }
}

# 使用 4-bit 量化加载模型
bnb_config = BitsAndBytesConfig(load_in_4bit=True)

# 加载模型并使用 DeepSpeed 初始化模型引擎
model = AutoModelForCausalLM.from_pretrained(model_path, quantization_config=bnb_config)
model_engine, optimizer, _, _ = deepspeed.initialize(
    model=model,
    model_parameters=model.parameters(),
    config_params=ds_config
)

# 请求体，允许传入额外参数来控制模型生成
class RequestData(BaseModel):
    prompt: str
    max_tokens: int
    temperature: float = 1.0  # 默认值为 1.0
    top_p: float = 1.0        # 默认值为 1.0
    top_k: int = 50           # 默认值为 50
    repetition_penalty: float = 1.0  # 默认值为 1.0，避免重复生成

# 响应体
class ResponseData(BaseModel):
    completion: str

# API 接口，用于生成文本
@app.post("/v1/completions", response_model=ResponseData)
async def get_completion(data: RequestData):
    # 使用 transformers 的生成函数来进行推理
    input_ids = tokenizer(data.prompt, return_tensors="pt").input_ids.to(model_engine.local_rank)
    outputs = model_engine.module.generate(
        input_ids,
        max_length=data.max_tokens + input_ids.shape[1],
        temperature=data.temperature,
        top_p=data.top_p,
        top_k=data.top_k,
        repetition_penalty=data.repetition_penalty,
        do_sample=True
    )

    # 解码生成的输出
    completion_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return ResponseData(completion=completion_text)

# # app.py

# from fastapi import FastAPI, Request
# from pydantic import BaseModel
# from vllm import SamplingParams
# import torch
# import deepspeed
# from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
# from fastapi.responses import StreamingResponse
# import json

# app = FastAPI()

# # 模型路径
# model_path = "/home/chuokun_xu/model/Llama-2-13b-hf"

# # 检查可用的 GPU 数量
# tensor_parallel_size = min(torch.cuda.device_count(), 2)  # 使用两张卡

# # 加载 tokenizer
# tokenizer = AutoTokenizer.from_pretrained(model_path)

# # 使用 DeepSpeed Zero-3 和模型并行加载模型
# ds_config = {
#     "train_batch_size": 1,
#     "zero_optimization": {
#         "stage": 3,
#         "offload_param": {
#             "device": "cpu",
#             "pin_memory": True
#         },
#         "offload_optimizer": {
#             "device": "cpu",
#             "pin_memory": True
#         }
#     },
#     "tensor_parallel": {
#         "enabled": True,
#         "tp_size": tensor_parallel_size,
#         "tp_gather_partitioned_activations": True
#     }
# }

# # 使用 4-bit 量化加载模型
# bnb_config = BitsAndBytesConfig(load_in_4bit=True)

# # 加载模型并使用 DeepSpeed 初始化模型引擎
# model = AutoModelForCausalLM.from_pretrained(model_path, quantization_config=bnb_config)
# model_engine, optimizer, _, _ = deepspeed.initialize(
#     model=model,
#     model_parameters=model.parameters(),
#     config_params=ds_config
# )

# # 请求体，允许传入额外参数来控制模型生成
# class RequestData(BaseModel):
#     prompt: str
#     max_tokens: int
#     temperature: float = 1.0  # 默认值为 1.0
#     top_p: float = 1.0        # 默认值为 1.0
#     top_k: int = 50           # 默认值为 50
#     repetition_penalty: float = 1.0  # 默认值为 1.0，避免重复生成

# # 响应体
# class ResponseData(BaseModel):
#     completion: str

# 流式响应生成器
# def generate_stream(model_engine, tokenizer, input_ids, max_length, temperature, top_p, top_k, repetition_penalty):
#     past_length = input_ids.shape[1]  # 初始输入的长度
#     for i in range(1, max_length + 1):
#         outputs = model_engine.module.generate(
#             input_ids,
#             max_length=i + past_length,
#             temperature=temperature,
#             top_p=top_p,
#             top_k=top_k,
#             repetition_penalty=repetition_penalty,
#             do_sample=True
#         )
#         # 解码新增生成的部分
#         new_tokens = outputs[0][past_length:].tolist()
#         completion_text = tokenizer.decode(new_tokens, skip_special_tokens=True)
#         past_length = len(outputs[0])  # 更新 past_length
#         yield json.dumps({"completion": completion_text}) + "\n"


# # API 接口，用于生成文本（流式）
# @app.post("/v1/completions", response_model=ResponseData)
# async def get_completion(data: RequestData):
#     # 使用 transformers 的生成函数来进行推理
#     input_ids = tokenizer(data.prompt, return_tensors="pt").input_ids.to(model_engine.local_rank)
#     return StreamingResponse(
#         generate_stream(
#             model_engine, tokenizer, input_ids, data.max_tokens, data.temperature,
#             data.top_p, data.top_k, data.repetition_penalty
#         ),
#         media_type="application/json"
#     )
