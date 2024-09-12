import os
from typing import Dict, List
from anthropic import Anthropic

# Initialize Anthropic client
client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

class AICrewMember:
    def __init__(self, role: str, expertise: List[str], personality: str, claude_model: str):
        self.role = role
        self.expertise = expertise
        self.personality = personality
        self.claude_model = claude_model
        self.context = []

    def get_prompt(self) -> str:
        return f"""You are the {self.role} AI for our DJ Mixer project. 
        Your expertise includes {', '.join(self.expertise)}. 
        Your personality is {self.personality}. 
        Please respond to queries in this role, maintaining this persona consistently."""

    def add_to_context(self, message: str):
        self.context.append(message)
        if len(self.context) > 5:  # Keep only last 5 messages for context
            self.context.pop(0)

    def get_response(self, query: str) -> str:
        full_prompt = self.get_prompt() + "\n\nContext:\n" + "\n".join(self.context) + "\n\nHuman: " + query + "\n\nAssistant:"
        response = client.completions.create(
            model=self.claude_model,
            prompt=full_prompt,
            max_tokens_to_sample=300,
            temperature=0.7
        )
        return response.completion

class AICrewManager:
    def __init__(self):
        self.crew: Dict[str, AICrewMember] = {
            "project_manager": AICrewMember("Project Manager", ["project planning", "resource allocation"], "organized and goal-oriented", "claude-3-opus-20240229"),
            "ui_ux_designer": AICrewMember("UI/UX Designer", ["user interface design", "user experience"], "creative and user-focused", "claude-3-sonnet-20240229"),
            "frontend_developer": AICrewMember("Frontend Developer", ["Android development", "UI implementation"], "detail-oriented and user-focused", "claude-3-sonnet-20240229"),
            "backend_developer": AICrewMember("Backend Developer", ["server-side logic", "API development"], "systematic and efficiency-focused", "claude-3-opus-20240229"),
            "database_engineer": AICrewMember("Database Engineer", ["database design", "query optimization"], "data-oriented and performance-focused", "claude-3-opus-20240229"),
            "qa_tester": AICrewMember("QA Tester", ["test planning", "bug identification"], "thorough and quality-focused", "claude-3-haiku-20240307"),
            "devops_engineer": AICrewMember("DevOps Engineer", ["CI/CD", "deployment automation"], "automation-focused and reliability-oriented", "claude-3-sonnet-20240229")
        }

    def get_response(self, role: str, query: str) -> str:
        if role not in self.crew:
            return "Error: Invalid role specified."
        crew_member = self.crew[role]
        response = crew_member.get_response(query)
        crew_member.add_to_context(f"Human: {query}\nAssistant: {response}")
        return response

# Usage example
if __name__ == "__main__":
    crew_manager = AICrewManager()
    
    # Example: Get a response from the UI/UX Designer
    ui_response = crew_manager.get_response("ui_ux_designer", "How should we design the main mixer interface for optimal user experience?")
    print("UI/UX Designer's response:", ui_response)
    
    # Example: Get a response from the Backend Developer
    backend_response = crew_manager.get_response("backend_developer", "What's the best way to structure our API for scalability?")
    print("Backend Developer's response:", backend_response)
